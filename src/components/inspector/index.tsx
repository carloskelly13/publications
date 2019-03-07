import * as React from "react";
import { InspectorContainer, Tabs, Tab } from "./components";
import { StateContext } from "../../contexts";
// import PublicationsIcon from "../icons/publications";
// import LayersIcon from "../icons/layers";
import DocumentTab from "./inspector-tab";
import LayersTab from "./layers-tab";

enum TabKey {
  Inspector,
  Layers,
}

export default function Inspector() {
  const { currentDocument } = React.useContext(StateContext);
  const [activeTab, setActiveTab] = React.useState<TabKey>(TabKey.Inspector);
  return (
    <InspectorContainer visible={!!currentDocument}>
      <Tabs>
        <Tab
          onClick={() => setActiveTab(TabKey.Inspector)}
          active={activeTab === TabKey.Inspector}
        >
          Inspector
        </Tab>
        <Tab
          onClick={() => setActiveTab(TabKey.Layers)}
          active={activeTab === TabKey.Layers}
        >
          Layers
        </Tab>
      </Tabs>
      {
        {
          [TabKey.Inspector]: <DocumentTab />,
          [TabKey.Layers]: <LayersTab />,
        }[activeTab]
      }
    </InspectorContainer>
  );
}
