import React, { useEffect, useState } from 'react';
import { createRoot } from "react-dom/client";

const Main = () => {
  const [tabUrls, setTabUrls] = useState<{ url: URL, title: string }[]>([]);

  useEffect(() => {
    // Fetch the list of tabs and their URLs
    chrome.tabs.query({}, (tabs) => {
      const urls = tabs.map((tab) => {
        const url = tab.url && new URL(tab.url);
        const title = tab.title;
        return { url, title };
      }).filter((tab) => tab.url && tab.title); // Filter out undefined values
      setTabUrls(urls as { url: URL, title: string }[]);
    });
  }, []);

  const handleTabClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault(); // Prevent the default click behavior
    // Find the tab with the clicked URL
    chrome.tabs.query({ url }, (tabs) => {
      if (tabs.length > 0) {
        // Activate the tab
        chrome.tabs.update(tabs[0].id!, { active: true });
      }
    });
  };

  return (
    <div>
      <h1>Tab URLs</h1>
      <ul>
        {tabUrls.map((tab, index) => (
          <div key={index} onClick={(e) => handleTabClick(e, tab.url.href)} style={{ cursor: 'pointer' }}>
            <a href={tab.url.href} onMouseOver={(e) => (e.target as HTMLAnchorElement).style.textDecoration = 'underline'} onMouseOut={(e) => (e.target as HTMLAnchorElement).style.textDecoration = 'none'}>
              {tab.title}
            </a>
          </div>
        ))}
      </ul>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);