import * as React from 'react'

import styles from './styles/WordListPage.module.scss'
import { transformStyles } from 'react-dom-basic-kit'
const cx = transformStyles(styles)

type IWordListPageProps = {}

export const WordListPage: React.FC<IWordListPageProps> = (props: any) => {
  return <div className={cx('word-list-page')}>1</div>
}

export default WordListPage
