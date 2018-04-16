module.exports = {
  staticFileGlobs:
   [ 'dist/**.html',
     'dist/**.js',
     'dist/**.css',
     'dist/assets/images/*',
     'dist/assets/icons/*',
     'dist/**.woff*',
     'dist/**.eot',
     'dist/**.svg',
     'dist/**.ttf'
   ],
  runtimeCaching:[{ 
      urlPattern: /\/app\/files\/upload\/*\/*/,
      handler: 'cacheFirst',
      options: {
        cache: {
          maxEntries: 500,
          name: 'twotree-images-cache'
        }
      }
   }],
  root: 'dist',
  stripPrefix: 'dist/',
  navigateFallback: '/index.html'};
