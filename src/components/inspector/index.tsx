import * as React from "react";
import { InspectorContainer } from "./components";
import { StateContext } from "../../contexts/documents-provider";
import DocumentTab from "./inspector-tab";
import LayersTab from "./layers-tab";
import InspectorTabs from "./tabs";

export enum TabKey {
  Inspector,
  Layers,
}

export default function Inspector() {
  const { currentDocument } = React.useContext(StateContext);
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
