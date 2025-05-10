// vue.config.js
module.exports = {
    pwa: {
        name: 'Mi PWA',
        short_name: 'PWA',
        themeColor: '#4DBA87',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black-translucent',
        manifestOptions: {
            start_url: '/',
            display: 'standalone',
            orientation: 'portrait',
            background_color: '#ffffff',
            icons: [
                  {
                        src: '/icons/144.png',
                        sizes: '144x144',
                        type: 'image/png',
                    },  
                  {
                        src: '/icons/512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/1024.png',
                        sizes: '1024x1024',
                        type: 'image/png',
                    },
                ],
        }
    }
}