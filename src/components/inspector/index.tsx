import * as React from "react";
import { InspectorContainer, Tabs, Tab } from "./components";
import { StateContext } from "../../contexts";
import DocumentTab from "./inspector-tab";
import LayersTab from "./layers-tab";
import InspectorTabs from "./tabs";

export enum TabKey {
  Inspector,
  Layers,
  NewDocument,
  OpenDocument,
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
