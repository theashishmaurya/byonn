import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import React from 'react';
import { ReactNode, useEffect, useRef, useState } from 'react';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

interface SharedState {
  [key: string]: any;
}

interface ComponentLinkProps {
  componentName: string;
  id: string;
  [key: string]: any;
}

interface InteractiveComponentProps {
  isActive: boolean;
  sharedState: SharedState;
  updateSharedState: (key: string, value: any) => void;
}

interface InteractiveMDXWrapperProps {
  children: ReactNode;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  const InteractiveMDXWrapper: React.FC<InteractiveMDXWrapperProps> = ({
    children,
  }) => {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const articleRef = useRef<HTMLDivElement | null>(null);
    const [sharedState, setSharedState] = useState<SharedState>({});

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target.id) {
              setActiveSection(entry.target.id);
            } else if (activeSection === entry.target.id) {
              setActiveSection(null);
            }
          });
        },
        { threshold: 0.5 }
      );

      const article = articleRef?.current;
      if (article) {
        const sections = article.querySelectorAll('[data-section]');
        sections.forEach((section) => observer.observe(section));
      }

      return () => {
        if (article) {
          const sections = article.querySelectorAll('[data-section]');
          sections.forEach((section) => observer.unobserve(section));
        }
      };
    }, [activeSection]);

    const updateSharedState = (key: string, value: any) => {
      setSharedState((prevState) => ({ ...prevState, [key]: value }));
    };

    return (
      <div className='flex h-screen overflow-hidden'>
        <div
          style={{ width: '50%', overflow: 'auto' }}
          className='p-4 overflow-y-auto border border-solid'
          ref={articleRef}>
          {children}
        </div>
        <div
          style={{ width: '50%', overflow: 'hidden' }}
          className='w-1/2 p-4 overflow-y-hidden flex justify-center items-center'>
          {activeSection &&
            components[activeSection] &&
            React.createElement(
              components[
                activeSection
              ] as React.ComponentType<InteractiveComponentProps>,
              {
                isActive: true,
                sharedState,
                updateSharedState,
              }
            )}
        </div>
      </div>
    );
  };

  return {
    wrapper: InteractiveMDXWrapper,

    // Existing image enhancement
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image
        sizes='100vw'
        style={{ width: '100%', height: 'auto' }}
        {...(props as ImageProps)}
      />
    ),
    // New interactive components
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 {...props}>{children}</h2>
    ),
    ComponentLink: ({ componentName, ...props }: ComponentLinkProps) => {
      return <div data-section id={props.id}></div>;
    },
    ...components,
  };
}
