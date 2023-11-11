import { useState } from 'react';
import { CardContent, Tabs, Tab } from '@mui/material';
import ChangeUsername from '../settings/ChangeUsername';
import ChangePassword from '../settings/ChangePassword';
import ChangeName from '../settings/ChangeName';
import { Post } from '../components/Content';

type TabName = 'Change Name' | 'Change Username' | 'Change Password';
export interface SettingsProps {
  posts: Post[]
  setPosts: (posts: Post[]) => void
}

export default function Settings({posts,setPosts}:SettingsProps) {
  const [activeTab, setActiveTab] = useState<TabName | null>('Change Username');

  const toggleTab = (tabName: TabName) => {
    setActiveTab(activeTab === tabName ? null : tabName);
  };

  return (
    <div style={{ background:'transparent',border:'none' }}>
      <h2 style={{ padding:'.5em 1em' }}>
        Settings
      </h2>
      <CardContent sx={{ background:'white' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => toggleTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Change Name" value="Change Name" />
          <Tab label="Change Username" value="Change Username" />
          <Tab label="Change Password" value="Change Password" />
        </Tabs>
        {activeTab === 'Change Name' && <ChangeName />}
        {activeTab === 'Change Username' && <ChangeUsername posts={posts} setPosts={setPosts} />}
        {activeTab === 'Change Password' && <ChangePassword />}
      </CardContent>
    </div>
  );
}
