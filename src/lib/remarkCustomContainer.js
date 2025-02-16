import { visit } from 'unist-util-visit'

const BLUE_POPUP_INDICATOR = /\(\((\d+)\)\)/g
const GRAY_POPUP_INDICATOR = /\{\((\d+)\)\}/g
const BLUE_POPUP_CONTENT = /^\((\d+)\):\s*(?!@[”“"])(.*)$/gm
const GRAY_POPUP_CONTENT = /^\{(\d+)\}:\s*(?!@[”“"])(.*)$/gm
const BLUE_MULTILINE_CONTENT = /^\((\d+)\):\s*@[”“"]\s?([\s\S]*?)\s?[”“"]@$/gm
const GRAY_MULTILINE_CONTENT = /^\{(\d+)\}:\s*@[”“"]\s?([\s\S]*?)\s?[”“"]@$/gm

export function remarkCustomContainer() {
	return (/** @type {any} */ tree) => {
		visit(tree, (node) => {
			if (node.type === 'text') {
				let value = node.value

				let blueIndicators = [...value.matchAll(BLUE_POPUP_INDICATOR)].map((match) => ({
					number: match[1],
					fullMatch: match[0],
					html: `<span class="blue-popup" data-number="${match[1]}">
    <span class="popup-trigger">${match[1]}</span>
    <span class="popup-content">fake content</span>
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
					html: `<span class="gray-popup" data-number="${match[1]}">
    <span class="popup-trigger">${match[1]}</span>
    <span class="popup-content">fake content</span>
  </span>`
				}))

				if (grayIndicators.length > 0) {
					console.log(
						'Gray Indicators:',
						grayIndicators.map((m) => ({ number: m.number, html: m.html }))
					)
				}

				let grayContents = [...value.matchAll(GRAY_POPUP_CONTENT)].map((match) => ({
					number: match[1],
					content: match[2],
					fullMatch: match[0],
					script: `<script>window.popupContent.gray.set('${match[1]}', ${JSON.stringify(match[2])});</script>`
				}))

				if (grayContents.length > 0) {
					console.log(
						'Gray Contents:',
						grayContents.map((m) => ({
							number: m.number,
							content: m.content,
							fullMatch: m.fullMatch
						}))
					)
				}

				let grayMultilineContents = [...value.matchAll(GRAY_MULTILINE_CONTENT)].map((match) => ({
					number: match[1],
					content: match[2].replace(/\n/g, '<br>'),
					fullMatch: match[0],
					script: `<script>window.popupContent.gray.set('${match[1]}', ${JSON.stringify(match[2].replace(/\n/g, '<br>'))});</script>`
				}))

				if (grayMultilineContents.length > 0) {
					console.log(
						'Gray Multiline Contents:',
						grayMultilineContents.map((m) => ({
							number: m.number,
							content: m.content,
							fullMatch: m.fullMatch
						}))
					)
				}

				// Merging them
				let allContents = [
					...blueMultilineContents,
					...blueContents,
					...grayMultilineContents,
					...grayContents
				]
				let allIndicators = [...blueIndicators, ...grayIndicators]
				// grayContents = []

				let newValue = value

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

				if (newValue !== node.value) {
					// console.log('node.value:', JSON.stringify(node.value))

					value = newValue
					node.type = 'html'
					node.value = value
				}
			}
		})
	}
}
