import { Node } from 'unist'
import visit from 'unist-util-visit'

const plugin = () => {
  return (tree: Node) => {
    visit(tree, ['image'], (node: Node) => {
      const url = node.url as string
      if (url.startsWith('/')) node.url = '/media' + url
    })
  }
}

export default plugin
