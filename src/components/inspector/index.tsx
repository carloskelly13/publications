import * as React from "react";
import { InspectorContainer, Tabs, Tab } from "./components";
import { StateContext } from "../../contexts";
import PublicationsIcon from "../icons/publications";
import FormatIcon from "../icons/format";
import LayersIcon from "../icons/layers";
import LayersTab from "./layers-tab";
import FormatTab from "./format-tab";

enum TabKey {
  Document,
  Format,
  Layers,
}

export default function Inspector() {
  const { currentDocument } = React.useContext(StateContext);
  const [activeTab, setActiveTab] = React.useState<TabKey>(TabKey.Document);
  return (
    <InspectorContainer visible={!!currentDocument}>
      <Tabs>
        <Tab
          onClick={() => setActiveTab(TabKey.Document)}
          active={activeTab === TabKey.Document}
        >
          <PublicationsIcon active={activeTab === TabKey.Document} />
        </Tab>
        <Tab
          onClick={() => setActiveTab(TabKey.Format)}
          active={activeTab === TabKey.Format}
        >
          <FormatIcon active={activeTab === TabKey.Format} />
        </Tab>
        <Tab
          onClick={() => setActiveTab(TabKey.Layers)}
          active={activeTab === TabKey.Layers}
        >
          <LayersIcon active={activeTab === TabKey.Layers} />
        </Tab>
      </Tabs>
      {
        {
          [TabKey.Document]: null,
          [TabKey.Format]: <FormatTab />,
          [TabKey.Layers]: <LayersTab />,
        }[activeTab]
      }
    </InspectorContainer>
  );
}
