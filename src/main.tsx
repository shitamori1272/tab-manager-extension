import React, { useEffect, useState } from 'react';
import { createRoot } from "react-dom/client";

const Main = () => {
  const [tabUrls, setTabUrls] = useState<string[]>([]);

  useEffect(() => {
    // Fetch the list of tabs and their URLs
    chrome.tabs.query({}, (tabs) => {
      const urls = tabs.map((tab) => tab.url).filter(Boolean) as string[]; // Filter out undefined values
      setTabUrls(urls);
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
        {tabUrls.map((url, index) => (
          <div key={index} onClick={(e) => handleTabClick(e, url)} style={{ cursor: 'pointer' }}>
            <a href={url} onMouseOver={(e) => (e.target as HTMLAnchorElement).style.textDecoration = 'underline'} onMouseOut={(e) => (e.target as HTMLAnchorElement).style.textDecoration = 'none'}>
              {url}
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