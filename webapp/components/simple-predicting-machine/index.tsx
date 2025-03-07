import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';

interface ErrorCalculatorProps {
  realValue: number;
  generatedValue: number;
}

const ErrorCalculator: React.FC<ErrorCalculatorProps> = ({
  realValue,
  generatedValue,
}) => {
  const absoluteError = Math.abs(realValue - generatedValue);
  const relativeError = (absoluteError / realValue) * 100;

  return (
    <div className='mt-4 space-y-2'>
      <p>Absolute Error: {absoluteError.toFixed(2)}</p>
      <p>Relative Error: {relativeError.toFixed(2)}%</p>
    </div>
  );
};

interface InteractiveSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
}

const InteractiveSlider: React.FC<InteractiveSliderProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  label,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const bgColor = `hsl(${percentage * 1.2}, 100%, 50%)`;

  return (
    <div className='relative pt-1'>
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
      </label>
      <div className='flex items-center'>
        <input
          type='range'
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
          style={{
            background: `linear-gradient(to right, ${bgColor} 0%, ${bgColor} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
        <span
          className='absolute text-sm text-white font-bold rounded px-2 transform -translate-y-1/2'
          style={{
            left: `calc(${percentage}% - 20px)`,
            top: '50%',
            backgroundColor: bgColor,
          }}>
          {value.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

interface ChartDataPoint {
  km: number;
  predicted: number;
  actual: number;
}

const EnhancedPredictingMachine: React.FC = () => {
  const [kilometer, setKilometer] = useState<number>(100);
  const [constant, setConstant] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const newData: ChartDataPoint[] = [];
    for (let i = 0; i <= 10; i++) {
      newData.push({
        km: i,
        predicted: i * constant,
        actual: i * 0.6,
      });
    }
    setChartData(newData);
  }, [constant]);

  const chartConfig = {
    predicted: {
      label: 'Predicted',
      color: 'hsl(var(--chart-1))',
    },
    actual: {
      label: 'Actual',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <Card className='w-full max-w-3xl mx-auto '>
      <CardHeader>
        <CardTitle>Predicting Machine</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 flex flex-col items-center'>
        <div className='space-y-6 w-[70%]'>
          <InteractiveSlider
            value={constant}
            onChange={setConstant}
            min={0}
            max={2}
            step={0.01}
            label='Constant'
          />
        </div>

        {/* <div className='text-sm w-[70%] font-bold text-center p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg'>
          Result: {(kilometer * constant).toFixed(2)}
        </div> */}

        <div className='flex justify-center'>
          <Card>
            <CardHeader>
              <CardTitle>A simple prediction Machine</CardTitle>
              <CardDescription>
                Move the above slider to predict the value of constant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='Km'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Line
                    dataKey='predicted'
                    type='monotone'
                    stroke='var(--color-predicted)'
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey='actual'
                    type='monotone'
                    stroke='var(--color-actual)'
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <ErrorCalculator
                realValue={kilometer * 0.6}
                generatedValue={kilometer * constant}
              />
            </CardFooter>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPredictingMachine;
