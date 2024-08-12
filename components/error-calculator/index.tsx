const ErrorCalculator = ({
  realValue,
  generatedValue,
}: {
  realValue: number;
  generatedValue: number;
}) => {
  return (
    <div>
      <div>
        Error = {realValue} - {generatedValue}
      </div>
      <div>Error = {realValue - generatedValue}</div>
    </div>
  );
};

export default ErrorCalculator;
