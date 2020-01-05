import * as React from "react";
import { InspectorContainer } from "./components";
import DocumentTab from "./inspector-tab";
import LayersTab from "./layers-tab";
import InspectorTabs from "./tabs";
import { useAppStateContext } from "../../contexts/app-state-provider";

export enum TabKey {
  Inspector,
  Layers,
}

export default function Inspector() {
  const { currentDocument } = useAppStateContext();
  const [activeTab, setActiveTab] = React.useState<TabKey>(TabKey.Inspector);
  return (
    <InspectorContainer visible={!!currentDocument}>
      <InspectorTabs setActiveTab={setActiveTab} activeTab={activeTab} />
      {
        {
          [TabKey.Inspector]: <DocumentTab />,
          [TabKey.Layers]: <LayersTab />,
        }[activeTab]
      }
    </InspectorContainer>
  );
}
