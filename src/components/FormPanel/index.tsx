import { ScriptInfo } from './ScriptInfo';
import { DateTimeLocation } from './DateTimeLocation';
import { PlayerConfig } from './PlayerConfig';

export const FormPanel = () => {
  return (
    <div className="space-y-4">
      <ScriptInfo />
      <DateTimeLocation />
      <PlayerConfig />
    </div>
  );
};
