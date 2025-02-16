import { visit } from 'unist-util-visit'

const BLUE_POPUP_INDICATOR = /\(\((\d+)\)\)/g
const GRAY_POPUP_INDICATOR = /\{\{(\d+)\}\}/g
const BLUE_POPUP_CONTENT = /^\((\d+)\):\s*(.*)$/gm
const GRAY_POPUP_CONTENT = /^\{(\d+)\}:\s*(.*)$/gm

export function remarkCustomContainer() {
	return (/** @type {any} */ tree) => {
		visit(tree, (node) => {
			if (node.type === 'text') {
				let value = node.value

				let blueContents = [...value.matchAll(BLUE_POPUP_CONTENT)].map((match) => ({
					number: match[1],
					content: match[2],
					fullMatch: match[0],
					script: `<script>window.popupContent.blue.set('${match[1]}', ${JSON.stringify(match[2])});</script>`
				}))
				if (blueContents.length > 0) {
					console.log(
						'Blue Contents:',
						blueContents.map((m) => ({ number: m.number, content: m.content }))
					)
				}

				let blueIndicators = [...value.matchAll(BLUE_POPUP_INDICATOR)].map((match) => ({
					number: match[1],
					fullMatch: match[0],
					html: `<span class="blue-popup" data-number="${match[1]}">
    <span class="popup-trigger">${match[0]}</span>
    <span class="popup-content">fake content</span>
  </span>`
				}))
				if (blueIndicators.length > 0) {
					console.log(
						'Blue Indicators:',
						blueIndicators.map((m) => ({ number: m.number, html: m.html }))
					)
				}

				let grayIndicators = [...value.matchAll(GRAY_POPUP_INDICATOR)].map((match) => ({
					number: match[1],
					fullMatch: match[0],
					html: `<span class="gray-popup" data-number="${match[1]}">
    <span class="popup-trigger">${match[0]}</span>
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
						grayContents.map((m) => ({ number: m.number, content: m.content }))
					)
				}

				let newValue = value

				blueContents.forEach(({ fullMatch, script }) => {
					newValue = newValue.replace(fullMatch, script)
				})

				grayContents.forEach(({ fullMatch, script }) => {
					newValue = newValue.replace(fullMatch, script)
				})

				blueIndicators.forEach(({ fullMatch, html }) => {
					newValue = newValue.replace(fullMatch, html)
				})

				grayIndicators.forEach(({ fullMatch, html }) => {
					newValue = newValue.replace(fullMatch, html)
				})

				if (newValue !== node.value) {
					value = newValue
					node.type = 'html'
					node.value = value
				}
			}
		})
	}
}
