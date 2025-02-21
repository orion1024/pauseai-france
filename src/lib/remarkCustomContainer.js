import { visit } from 'unist-util-visit'

const BLUE_POPUP_INDICATOR = /\(\((\d+)\)\)/g
const GRAY_POPUP_INDICATOR = /\{\((\d+)\)\}/g
const BLUE_POPUP_CONTENT = /^\((\d+)\):\s*(?!@[”“"])(.*)$/gm
const GRAY_POPUP_CONTENT = /^\{(\d+)\}:\s*(?!@[”“"])(.*)$/gm
const BLUE_MULTILINE_CONTENT = /^\((\d+)\):\s*@[”“"]\s?([\s\S]*?)\s?[”“"]@$/gm
const GRAY_MULTILINE_CONTENT = /^\{(\d+)\}:\s*@[”“"]\s?([\s\S]*?)\s?[”“"]@$/gm
const BLUEBOX_START_PATTERN = /^::bluebox\-start::$/g
const BLUEBOX_END_PATTERN = /^::bluebox\-end::$/g
const BLUEBOX2_START_PATTERN = /^::bluebox2\-start::$/g
const BLUEBOX2_END_PATTERN = /^::bluebox2\-end::$/g
const BLUE_POPUP_CLASS = 'blue-popup'
const GRAY_POPUP_CLASS = 'gray-popup'
const POPUP_TRIGGER_CLASS = 'popup-trigger'
const POPUP_CONTENT_CLASS = 'popup-content'
const BLUEBOX_CLASS = 'bluebox'
const BLUEBOX2_CLASS = 'bluebox2'

export function remarkCustomContainer() {
	return (/** @type {any} */ tree) => {
		visit(tree, (node) => {
			if (node.type === 'text') {
				let value = node.value
				let newValue = value

				if (BLUEBOX_START_PATTERN.test(value)) {
					newValue = `<span class="${BLUEBOX_CLASS}">test1</span>`
				} else if (BLUEBOX2_START_PATTERN.test(value)) {
					newValue = `<span class="${BLUEBOX2_CLASS}">test2</span>`
				} else if (BLUEBOX_END_PATTERN.test(value) || BLUEBOX2_END_PATTERN.test(value)) {
					newValue = '<span></span>'
				} else {
					let blueIndicators = [...value.matchAll(BLUE_POPUP_INDICATOR)].map((match) => ({
						number: match[1],
						fullMatch: match[0],
						html: `<span class="${BLUE_POPUP_CLASS}" data-number="${match[1]}">
		<span class="${POPUP_TRIGGER_CLASS}">${match[1]}</span>
		<span class="${POPUP_CONTENT_CLASS}">fake content</span>
	  </span>`
					}))
					// if (blueIndicators.length > 0) {
					// 	console.log(
					// 		'Blue Indicators:',
					// 		blueIndicators.map((m) => ({ number: m.number, html: m.html }))
					// 	)
					// }

					let blueContents = [...value.matchAll(BLUE_POPUP_CONTENT)].map((match) => ({
						number: match[1],
						content: match[2],
						fullMatch: match[0],
						script: `<script>window.popupContent.blue.set('${match[1]}', ${JSON.stringify(match[2])});</script>`
					}))
					// if (blueContents.length > 0) {
					// 	console.log(
					// 		'Blue Contents:',
					// 		blueContents.map((m) => ({
					// 			number: m.number,
					// 			content: m.content,
					// 			fullMatch: m.fullMatch
					// 		}))
					// 	)
					// }

					let blueMultilineContents = [...value.matchAll(BLUE_MULTILINE_CONTENT)].map((match) => ({
						number: match[1],
						content: match[2].replace(/\n/g, '<br>'),
						fullMatch: match[0],
						script: `<script>window.popupContent.blue.set('${match[1]}', ${JSON.stringify(match[2].replace(/\n/g, '<br>'))});</script>`
					}))
					//   if (blueMultilineContents.length > 0) {
					// 	console.log('Blue Multiline Contents:', blueMultilineContents.map(m => ({ number: m.number, content: m.content, fullMatch: m.fullMatch })));
					//   }

					let grayIndicators = [...value.matchAll(GRAY_POPUP_INDICATOR)].map((match) => ({
						number: match[1],
						fullMatch: match[0],
						html: `<span class="${GRAY_POPUP_CLASS}" data-number="${match[1]}">
		<span class="${POPUP_TRIGGER_CLASS}">${match[1]}</span>
		<span class="${POPUP_CONTENT_CLASS}">fake content</span>
	  </span>`
					}))

					// if (grayIndicators.length > 0) {
					// 	console.log(
					// 		'Gray Indicators:',
					// 		grayIndicators.map((m) => ({ number: m.number, html: m.html }))
					// 	)
					// }

					let grayContents = [...value.matchAll(GRAY_POPUP_CONTENT)].map((match) => ({
						number: match[1],
						content: match[2],
						fullMatch: match[0],
						script: `<script>window.popupContent.gray.set('${match[1]}', ${JSON.stringify(match[2])});</script>`
					}))

					// if (grayContents.length > 0) {
					// 	console.log(
					// 		'Gray Contents:',
					// 		grayContents.map((m) => ({
					// 			number: m.number,
					// 			content: m.content,
					// 			fullMatch: m.fullMatch
					// 		}))
					// 	)
					// }

					let grayMultilineContents = [...value.matchAll(GRAY_MULTILINE_CONTENT)].map((match) => ({
						number: match[1],
						content: match[2].replace(/\n/g, '<br>'),
						fullMatch: match[0],
						script: `<script>window.popupContent.gray.set('${match[1]}', ${JSON.stringify(match[2].replace(/\n/g, '<br>'))});</script>`
					}))

					// if (grayMultilineContents.length > 0) {
					// 	console.log(
					// 		'Gray Multiline Contents:',
					// 		grayMultilineContents.map((m) => ({
					// 			number: m.number,
					// 			content: m.content,
					// 			fullMatch: m.fullMatch
					// 		}))
					// 	)
					// }

					// Merging them
					let allContents = [
						...blueMultilineContents,
						...blueContents,
						...grayMultilineContents,
						...grayContents
					]
					let allIndicators = [...blueIndicators, ...grayIndicators]
					// grayContents = []

					if (
						blueIndicators.length ||
						grayIndicators.length ||
						blueContents.length ||
						grayContents.length
					) {
						newValue = newValue.replace(/\n/g, '<br>')
						// console.log('newValue:', JSON.stringify(newValue))
					}

					allContents.forEach(({ fullMatch, script }) => {
						let replaceString = fullMatch.replace(/\n/g, '<br>')
						newValue = newValue.replace(replaceString + '<br>', script)
						newValue = newValue.replace(replaceString, script)
					})

					allIndicators.forEach(({ fullMatch, html }) => {
						newValue = newValue.replace(fullMatch, html)
					})
				}

				// console.log('node :', JSON.stringify(node))
				if (newValue !== node.value) {
					node.value = newValue
					console.log('node.value:', JSON.stringify(node.value))
					node.type = 'html'
				}
			}
		})
	}
}
