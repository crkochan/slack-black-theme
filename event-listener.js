// Slack Night Mood theme
document.addEventListener("DOMContentLoaded", function() {
    // Then get its webviews
    let webviews = document.querySelectorAll(".TeamView webview");
    // Fetch our CSS in parallel ahead of time
    const cssPath = 'https://cdn.rawgit.com/laCour/slack-night-mode/master/css/raw/black.css';
    const customCssPath = 'https://raw.githubusercontent.com/crkochan/slack-black-theme/master/custom.css';
    let cssPromise = fetch(cssPath).then(response => response.text());
    let customCSS = fetch(customCssPath).then(response => response.text());

    let customCustomCSS = `
    :root {
       /* Modify these to change your theme colors: */
      --primary: #61AFEF;
      --text: white;
    }
    `

    // Insert a style tags into the wrapper view
    cssPromise.then(css => {
        let s = document.createElement('style');
        s.type = 'text/css';
        s.id = 'slack-custom-css';
        s.innerHTML = css + customCustomCSS;
        document.head.appendChild(s);
    });

    customCSS.then(customCss => {
        let s = document.createElement('style');
        s.type = 'text/css';
        s.id = 'slack-extra-custom-css'
        s.innerHTML = customCss;
        document.head.appendChild(s);
    });

    // Wait for each webview to load
    webviews.forEach(webview => {
        webview.addEventListener('ipc-message', message => {
            if (message.channel == 'didFinishLoading')
            // Finally add the CSS into the webview
                cssPromise.then(css => {
                    let script = `
                        let s = document.createElement('style');
                        s.type = 'text/css';
                        s.id = 'slack-custom-css';
                        s.innerHTML = \`${css + customCustomCSS}\`;
                        document.head.appendChild(s);
                        `
                    webview.executeJavaScript(script);
                });
                customCSS.then(customCss => {
                    let script = `
                        let s = document.createElement('style');
                        s.type = 'text/css';
                        s.id = 'slack-extra-custom-css';
                        s.innerHTML = \`${customCss}\`;
                        document.head.appendChild(s);
                        `
                    webview.executeJavaScript(script);
                });
        });
    });
});
