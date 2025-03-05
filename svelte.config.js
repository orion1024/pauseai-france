import adapter from '@sveltejs/adapter-netlify'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

import { mdsvex, escapeSvelte } from 'mdsvex'
import { getHighlighter } from 'shiki'
import remarkUnwrapImages from 'remark-unwrap-images'

// TODO clean comments
// import remarkParse from 'remark-parse'
// import remarkRehype from 'remark-rehype'
// import rehypeStringify from 'rehype-stringify'
// import remarkDirective from 'remark-directive'
// import {rehypeCustomClass} from './src/lib/rehypeCustomclass.js'

import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import { faqPlugin } from './src/lib/faqPlugin.js'
import { remarkFrenchTypography } from './src/lib/typographyPlugin.js'
import { rehypeWBWPopups, rehypeWBWPopups2 } from './src/lib/rehypeWBWPlugins.js'
import { rehypeWBWBlueBoxes } from './src/lib/rehypeWBWPlugins.js'

import { config as dotenv } from 'dotenv'
dotenv()

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	layout: {
		_: './src/lib/layouts/mdsvex.svelte',
		waitbutwhy: './src/lib/layouts/waitbutwhy.svelte'
	},
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const highlighter = await getHighlighter({ theme: 'poimandres' })
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang }))
			return `{@html \`${html}\` }`
		}
	},
	remarkPlugins: [
		// remarkParse,
		// remarkDirective,
		// rehypeWBWBlueBoxes,
		// rehypeWBWPopups,
		// [remarkRehype, {allowDangerousHtml: true}],
		// [rehypeStringify, {allowDangerousHtml: true}],
		remarkUnwrapImages,
		[remarkToc, { tight: true }],
		remarkFrenchTypography
	],
	rehypePlugins: [rehypeWBWBlueBoxes, rehypeWBWPopups2, rehypeSlug, faqPlugin]
}
/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex(mdsvexOptions), vitePreprocess()],
	kit: {
		adapter: adapter({
			edge: true
		}),
		prerender: {
			entries: process.env.PUBLIC_UNDER_CONSTRUCTION === 'true' ? [] : ['*']
		},
		alias: {
			$assets: './src/assets',
			$posts: './src/posts',
			$components: './src/lib/components',
			$config: './src/lib/config.ts',
			$routes: './src/routes'
		}
	}
}

export default config
