import { Stack, StackProps } from '@stacks/ui';

import { FeeMultiplierButton } from './fee-multiplier-button';

const multipliers = [2, 5, 10];

interface FeeMultiplierProps extends StackProps {
  onSelectMultiplier(multiplier: number): void;
  showReset?: boolean;
}

export function FeeMultiplier(props: FeeMultiplierProps): React.JSX.Element {
  const { onSelectMultiplier, showReset, ...rest } = props;

  return (
    <Stack alignItems="center" isInline {...rest}>
      {showReset && (
        <FeeMultiplierButton
          multiplier={1}
          key={`multiply-1`}
          onClick={() => onSelectMultiplier(1)}
        />
      )}
      {multipliers.map(multiplier => (
        <FeeMultiplierButton
          multiplier={multiplier}
          onClick={() => onSelectMultiplier(multiplier)}
          key={`multiply-${multiplier}`}
        />
      ))}
    </Stack>
  );
}
