import * as React from 'react'
import qs from 'qs'
import styles from './styles/WordCardPage.module.scss'
import { transformStyles } from 'react-dom-basic-kit'
import AxiosClient from 'axios'
import { usePageProps, ConfirmModal, TipsModal } from '@smoex-mobile/basic'
import { useLocation } from 'react-router'
import { useModal } from 'react-dom-basic-kit'
const cx = transformStyles(styles)

type IWordCardPageProps = {}

export const fetchAPI = AxiosClient.create({
  baseURL: process.env.PUBLIC_URL,
  // baseURL: 'https://api.smoex.com',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})
export const fetchTrans = AxiosClient.create({
  baseURL: 'http://fanyi.youdao.com',
  timeout: 100000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})
// http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=计算

const getPage = (book: string) => {
  const str = localStorage.getItem(book)
  if (str) {
    const info = JSON.parse(str)
    return info
  }
  return null
}

function useCircularCounter(max: number, min = 0): [number, any] {
  const [count, setCount] = React.useState(-1)
  const setOffset = React.useCallback(
    (offset: number) => () => {
      setCount((idx) => {
        const pos = idx + offset
        const len = max - 1
        if (pos < 0) {
          return len
        } else if (pos > len) {
          return 0
        }
        return pos
      })
    },
    [max],
  )
  React.useEffect(() => {
    if (max > 0) {
      setCount(0)
    }
  }, [max])
  return [count, setOffset]
}

function useLocationSearch(): any {
  const { search } = useLocation()
  return qs.parse(search, { ignoreQueryPrefix: true })
}

const WordVoiceText: React.FC<any> = (props) => {
  const { voice } = props

  const voiceChars = React.useMemo(() => {
    if (!voice) {
      return null
    }
    return voice.split(' ').map((x: string) => {
      const chars = []
      if (x.charAt(0) === x.charAt(1)) {
        chars.push({ c: x.charAt(0), s: 'lighter' })
        x = x.slice(1, x.length)
      }
      x.split('').forEach((c) => {
        if ('aeiouy'.includes(c)) {
          chars.push({ c })
        } else {
          chars.push({ c, s: 'light' })
        }
      })
      return { chars, styles: 'space' }
    })
  }, [voice])

  if (!voice) {
    return null
  }

  return (
    <div className={cx('word-voice')}>
      {voiceChars.map(({ chars, styles }: any, i: any) => (
        <span className={cx('voice-text', styles)} key={i}>
          {chars.map(({ c, s }: any, j: number) => (
            <span className={cx('voice-text', s)} key={j}>
              {c}
            </span>
          ))}
        </span>
      ))}
    </div>
  )
}

export const WordProcess: React.FC<any> = (props) => {
  const { idx, max } = props
  const modal = useModal((mProps: any) => (
    <TipsModal {...mProps}>
      <div>
        This is a tips for test tips modal
        <br />
        test
        <br />
        test
        <br />
        test
        <br />
        test
        <br />
        test
        <br />
        test
        <br />
        test
      </div>
    </TipsModal>
  ))
  return (
    <div className={cx('word-process')}>
      <div className={cx('word-tips')} onClick={modal.show}>
        Tips
      </div>
      <div className={cx('word-num')}>
        {idx + 1}/{max}
      </div>
    </div>
  )
}

export const WordCardPage: React.FC<IWordCardPageProps> = (props: any) => {
  const search = useLocationSearch()
  const [words, setWords] = React.useState([])
  const [trans, setTrans] = React.useState('')
  const [idx, onChangeCard] = useCircularCounter(words.length)
  const audioRef = React.useRef<HTMLAudioElement>()
  const word = words[idx] || {}
  const [played, setPlayed] = React.useState(false)
  usePageProps({ showFooter: false })

  const onConfirm = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setPlayed(true)
      })
    }
  }

  const modal = useModal((mProps: any) => (
    <ConfirmModal {...mProps} onConfirm={onConfirm}>
      <div>Please confirm for play audio.</div>
    </ConfirmModal>
  ))

  React.useEffect(() => {
    const resp = fetchAPI.get(`/wordlist/${search.book}.txt`)
    resp.then(({ data }) => {
      const wordlist: string[] = data.split('\n')
      const infos = wordlist.filter(Boolean).map((x) => {
        const m = x.split('--')
        return {
          chars: m[0].replace(/ /g, ''),
          voice: m[0],
          en: m[1],
        }
      })
      setWords(infos)
    })
  }, [])

  React.useEffect(() => {
    const info = getPage(search.book)
    if (words.length > 0 && info) {
      onChangeCard(info.page)()
    }
  }, [words, onChangeCard])

  React.useEffect(() => {
    if (idx === -1) {
      return
    }
    localStorage.setItem(
      search.book,
      JSON.stringify({
        page: idx,
        max: words.length,
      }),
    )
  }, [idx, words])

  React.useEffect(() => {
    if (idx !== -1 && audioRef.current) {
      audioRef.current
        .play()
        .catch((e) => {
          if (!played) {
            modal.show()
          }
        })
        .then(() => {
          setPlayed(true)
        })
    }
  }, [idx, word])

  const onPlayAudio = React.useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play()
    }
  }, [word])

  return (
    <section className={cx('word-card-page')}>
      <WordProcess idx={idx} max={words.length} />
      <div className={cx('word-text')} onClick={onPlayAudio}>
        <div>{word.chars}</div>
        <WordVoiceText voice={word.voice} />
        {trans && <div className={cx('word-trans')}>{trans}</div>}
      </div>
      {word.en && <div className={cx('meaning-en')}>{word.en}</div>}
      <div className={cx('card-actions')}>
        <div className={cx('card-prev')} onClick={onChangeCard(-1)}>
          PREV
        </div>
        <div className={cx('card-next')} onClick={onChangeCard(1)}>
          NEXT
        </div>
      </div>
      {word.chars && (
        <audio
          preload="none"
          ref={audioRef}
          src={`//media.shanbay.com/audio/us/${word.chars}.mp3`}
        />
      )}
    </section>
  )
}

export default WordCardPage
