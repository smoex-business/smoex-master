import * as React from 'react'

import styles from './styles/WordPage.module.scss'
import { transformStyles } from 'react-dom-basic-kit'
import { Link } from 'react-router-dom'
const cx = transformStyles(styles)

type IWordPageProps = {}

const getPage = (book: string) => {
  const str = localStorage.getItem(book)
  if (str) {
    const info = JSON.parse(str)
    return `${info.page + 1}/${info.max}`
  }
  return null
}

const books = ['NGSL', 'NGSL-S', 'NAWT', 'TSL', 'BSL']
export const WordPage: React.FC<IWordPageProps> = (props: any) => {
  return (
    <section className={cx('word-page')}>
      {books.map((book, i) => (
        <Link className={cx('word-book')} key={i} to={`/word/card?book=${book}`}>
          {book}
          <div className={cx('word-progress')}>{getPage(book)}</div>
        </Link>
      ))}
    </section>
  )
}

export default WordPage
