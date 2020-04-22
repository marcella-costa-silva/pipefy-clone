import React, { useRef, useContext } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import BoardContext from '../Board/context'

import { Container, Label } from './styles'

export default function Card({ data, index, listIndex }) {
  const ref = useRef()
  const { move } = useContext(BoardContext)

  const [{ isDragging }, dragRef] = useDrag({
    item: { 
      type: 'CARD', 
      index, 
      listIndex,
      // id: data.id, 
      // content: data.content 
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {
      const draggedListIndex = item.listIndex
      // const targetListIndex = listIndex

      const draggedIndex = item.index // Card que está sendo arrastado.
      const targetIndex = index // Card que está por baixo.

      // console.log(draggedIndex, targetIndex)

      if (draggedIndex === targetIndex) return
      
      const targetSize = ref.current.getBoundingClientRect() // Tamanho do elemento.
      const targetCenter = (targetSize.bottom - targetSize.top) / 2

      const draggedOffset = monitor.getClientOffset() // Distância dos itens.
      const draggedTop = draggedOffset.y - targetSize.top

      // console.log(draggedTop, targetCenter)

      if (draggedIndex < targetIndex && draggedTop < targetCenter) return // Não passou da metade do card.

      if (draggedIndex > targetIndex && draggedTop > targetCenter) return

      console.log('Passou da metade do card')

      move(draggedListIndex, draggedIndex, targetIndex) // De onde para onde.

      item.index = targetIndex
    }
  })

  dragRef(dropRef(ref))

  return (
    <Container ref={ref} isDragging={isDragging}>
      <header>
        { data.labels.map(label => <Label key={label} color={label} />) }
      </header>
      <p>{data.content}</p>

      {/* Verifica se tem imagem */}
      { data.user && <img src={data.user} alt='' /> }
    </Container>
  )
}