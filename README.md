# Google Chat Tab
Unofficial Google Chat add-on for Thunderbird, it adds a button in Spaces that opens a Google Chat tab in Thunderbird.
The [home page](https://addons.thunderbird.net/en-US/thunderbird/addon/google-chat-spaces-tab/) of the extension contains the latest code.

#### Installing 
A new Google Chat icon should appear in the Spaces Toolbar of Thunderbird. Click to open.

#### Installing from sources
Download the repository, zip it, rename it to Google-Chat-Tab.xpi and choose install addon from file in Thunderbird.

In linux the xpi file can be created with the following commands
* `git clone https://github.com/feranick/Thunderbird-Google-Chat-Tab`
* `cd ./Thunderbird-Google-Chat-Tab`
* `VERSION=$(cat ./manifest.json | jq --raw-output '.version')`
* `zip -r "../Google-Chat-Tab-${VERSION}-tb.xpi" *`
