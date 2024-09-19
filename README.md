# Google Chat Tab
Unofficial Google Chat add-on for Thunderbird, it adds a button that opens a Google Chat tab in Thunderbird.
The [home page](https://addons.mozilla.org/thunderbird/addon/thunderchat/) of the extension contains some pictures and reviews.

#### Installing 
A new Google Chat icon should appear in the top-right corner of Thunderbird. Click to open.

#### Installing from sources
Download the repository, zip it, rename it to Google-Chat-Tab.xpi and choose install addon from file in Thunderbird.

In linux the xpi file can be created with the following commands
* `git clone https://github.com/feranick/Thunderbird-Google-Chat-Tab`
* `cd ./Thunderbird-Google-Chat-Tab`
* `VERSION=$(cat ./manifest.json | jq --raw-output '.version')`
* `zip -r "../Google-Chat-Tab-${VERSION}-tb.xpi" *`
