var plugins = [{
      name: 'gatsby-plugin-mdx',
      plugin: require('/www/wwwroot/1_file/@elegantstack/node_modules/gatsby-plugin-mdx/gatsby-ssr.js'),
      options: {"plugins":[],"extensions":[".mdx",".md"],"gatsbyRemarkPlugins":[{"resolve":"/www/wwwroot/1_file/@elegantstack/node_modules/gatsby-remark-images","id":"6dd9f235-c397-5a75-81ad-31c91d237cec","name":"gatsby-remark-images","version":"6.8.0","modulePath":"/www/wwwroot/1_file/@elegantstack/node_modules/gatsby-remark-images/index.js","pluginOptions":{"plugins":[],"maxWidth":1140,"showCaptions":true,"linkImagesToOriginal":false,"disableBgImageOnAlpha":true},"nodeAPIs":["pluginOptionsSchema"],"browserAPIs":["onRouteUpdate"],"ssrAPIs":[]},{"resolve":"/www/wwwroot/1_file/@elegantstack/node_modules/gatsby-remark-embed-video","id":"f1dc350d-b65e-5e5d-a9ea-68729644d699","name":"gatsby-remark-embed-video","version":"3.1.1","modulePath":"/www/wwwroot/1_file/@elegantstack/node_modules/gatsby-remark-embed-video/index.js","pluginOptions":{"plugins":[],"width":800},"nodeAPIs":[],"browserAPIs":[],"ssrAPIs":[]},{"resolve":"/www/wwwroot/1_file/@elegantstack/node_modules/gatsby-remark-responsive-iframe","id":"14fa90d3-ae84-54a3-bb14-8c56bdcaa86e","name":"gatsby-remark-responsive-iframe","version":"5.8.0","modulePath":"/www/wwwroot/1_file/@elegantstack/node_modules/gatsby-remark-responsive-iframe/index.js","pluginOptions":{"plugins":[]},"nodeAPIs":[],"browserAPIs":[],"ssrAPIs":[]},{"resolve":"/www/wwwroot/1_file/@elegantstack/node_modules/gatsby-remark-copy-linked-files","id":"cf104666-f93f-5e9d-9c2e-1bd9003e1e14","name":"gatsby-remark-copy-linked-files","version":"5.8.0","modulePath":"/www/wwwroot/1_file/@elegantstack/node_modules/gatsby-remark-copy-linked-files/index.js","pluginOptions":{"plugins":[]},"nodeAPIs":[],"browserAPIs":[],"ssrAPIs":[]},{"resolve":"/www/wwwroot/1_file/@elegantstack/node_modules/gatsby-remark-smartypants","id":"d48194e5-b344-5f22-b93d-76045ee44e88","name":"gatsby-remark-smartypants","version":"5.8.0","modulePath":"/www/wwwroot/1_file/@elegantstack/node_modules/gatsby-remark-smartypants/index.js","pluginOptions":{"plugins":[]},"nodeAPIs":[],"browserAPIs":[],"ssrAPIs":[]}],"remarkPlugins":[null],"defaultLayouts":{},"lessBabel":false,"rehypePlugins":[],"mediaTypes":["text/markdown","text/x-markdown"],"root":"/www/wwwroot/1_file/@elegantstack/site","commonmark":false},
    },{
      name: 'gatsby-plugin-image',
      plugin: require('/www/wwwroot/1_file/@elegantstack/node_modules/gatsby-plugin-image/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-preconnect',
      plugin: require('/www/wwwroot/1_file/@elegantstack/node_modules/gatsby-plugin-preconnect/gatsby-ssr.js'),
      options: {"plugins":[],"domains":["https://fonts.gstatic.com/","https://fonts.googleapis.com/"]},
    },{
      name: 'gatsby-plugin-react-helmet',
      plugin: require('/www/wwwroot/1_file/@elegantstack/node_modules/gatsby-plugin-react-helmet/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      name: 'partytown',
      plugin: require('/www/wwwroot/1_file/@elegantstack/node_modules/gatsby/dist/internal-plugins/partytown/gatsby-ssr.js'),
      options: {"plugins":[]},
    }]
/* global plugins */
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

function augmentErrorWithPlugin(plugin, err) {
  if (plugin.name !== `default-site-plugin`) {
    // default-site-plugin is user code and will print proper stack trace,
    // so no point in annotating error message pointing out which plugin is root of the problem
    err.message += ` (from plugin: ${plugin.name})`
  }

  throw err
}

export function apiRunner(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  plugins.forEach(plugin => {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      return
    }

    try {
      const result = apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  })

  return results.length ? results : [defaultReturn]
}

export async function apiRunnerAsync(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  for (const plugin of plugins) {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      continue
    }

    try {
      const result = await apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  }

  return results.length ? results : [defaultReturn]
}
