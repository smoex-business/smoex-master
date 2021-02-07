import * as React from 'react'

import styles from './styles/SearchPage.module.scss'
import { Input, transformStyles } from '@react-kits/dom'
import { fetchAPI } from './WordCardPage'
const cx = transformStyles(styles)

const search = (keyword: string) => fetchAPI.get('/api/search/kanji', { params: { keyword }})

type ISearchPageProps = {}

const MAP = {
    1: '音',
    2: '训',
    3: '特',
}

export const SearchPage: React.FC<ISearchPageProps> = (props: any) => {
    const [keyword, setKeyword] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const [data, setData] = React.useState<any>({})
    const { kana = [], word = [], kanji = [] } = data 
    const onSearch = React.useCallback(() => {
        if (loading) {
            return
        }
        setLoading(true)
        search(keyword).then(res => {
            setData(res.data.data || {})
            setLoading(false)
        }).catch(x => {
            setLoading(false)
        })
    }, [keyword, loading])

    const onChange = React.useCallback((target: HTMLInputElement) => {
        setKeyword(target.value)
    }, [])
    
    return (
        <div>
            <div>
                <Input className={cx('inp')} onChange={onChange} placeholder="点击输入关键字" />
                <div className={cx('search-btn')} onClick={onSearch}>Search{loading && '...'}</div>
            </div>

            {kanji.length > 0 && (<>
                <div>KANJI: {kanji[0].text}</div>
                <div className={cx('wrapper')}>
                    {kanji[2].map((k: any, i: number) => (
                        <span className={cx('kana-item')} key={i}>{k.text}({MAP[k.type]})</span>
                    ))}
                </div>
            </>)}
            
            {kana.length > 0 && (<>
                <div>KANAS: </div>
                <div className={cx('wrapper')}>
                    {kana[0].map((k: any, i: number) => (
                        <span className={cx('kana-item')} key={i}>{k.text}({kana[1][i].text})</span>
                    ))}
                </div>
            </>)}

            {word.length > 0 && (<>
                <div>WORDS: </div>
                <div className={cx('wrapper')}>
                    {word.map((k: any, i: number) => !Array.isArray(k) ? (
                            <span className={cx('kana-item')} key={i}>{k.text}({k.kana})</span>
                        ) : (
                            k.map((x: any, j: any) => (
                                <span className={cx('kana-item')} key={`${i}-${j}`}>{x.text}({x.kana})</span>
                            )
                        )
                    ))}
                </div>
            </>)}
        </div>
    )
}

export default SearchPage