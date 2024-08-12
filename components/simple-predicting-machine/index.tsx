import { useState } from 'react';
import ErrorCalculator from '../error-calculator';

const SimplePredictingMachine = () => {
  const [killoMeter, setKilloMeter] = useState<number>(0);
  const [constant, setConstant] = useState<number>(0);

  console.log(killoMeter * constant);
  return (
    <div>
      <div>
        <label>KM</label>
        <input
          aria-label='Km'
          type='number'
          onChange={(e) => {
            setKilloMeter(+e.target.value);
          }}
        />
        <label>variable</label>
        <input
          aria-label='c'
          onChange={(e) => {
            setConstant(+e.target.value);
          }}
        />
        = answer: <div>{killoMeter * constant}</div>
      </div>
      {killoMeter > 0 && constant > 0 && (
        <ErrorCalculator
          realValue={killoMeter * 0.6}
          generatedValue={killoMeter * constant ?? 0}
        />
      )}
    </div>
  );
};

export default SimplePredictingMachine;
