import { visit } from 'unist-util-visit';

console.log('remarkCustomContainer.js loaded')

export function remarkCustomContainer() {
  // return (tree) => {
  //   visit(tree, (node) => {
  //     // console.log('Node type:', node.type, 'Content:', (node.value || ''))
  //     if ((node.value || '').includes('mon container')) {
  //       console.log('Node type:', node.type, 'Raw node:', node)
  //     }
  //     if (node.type === 'containerDirective') {
  //       node.data = {
  //         hName: 'div',
  //         hProperties: {
  //           className: node.name
  //         }
  //       }
  //     }
  //   })
  // }

  console.log('remarkCustomContainer plugin starting')
  return (tree) => {
    console.log('remarkCustomContainer transformer running')
    visit(tree, (node) => {
      if ((node.value || '').includes('PICK ME !')) {
        console.log('Found directive node:', {
          type: node.type,
          value: node.value,
          parent: node.parent?.type
        })
      }
    })
  }
}
