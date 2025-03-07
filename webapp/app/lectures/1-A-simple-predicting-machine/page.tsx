'use client';
import { useMDXComponents } from '@/mdx-components';
import Blog from './blog.mdx';
import { MDXComponents } from 'mdx/types';
import InteractiveComponent from '@/components/charts/interactive-chart';
import SimplePredictingMachine from '@/components/simple-predicting-machine';

const ComponentTwo = () => {
  return <div>Component two</div>;
};
export default function Lecture1() {
  const components: MDXComponents = useMDXComponents({
    ChartComponent: InteractiveComponent,
    ComponentTwo: ComponentTwo,
    SimplePredictingMachine: SimplePredictingMachine,
    // Add other components here
  });
  return <Blog components={components} />;
}
