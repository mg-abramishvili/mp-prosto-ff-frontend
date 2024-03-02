// dayjs
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export default {
    currency(value) {
        if (!value) return '0'
        return parseFloat(value).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽'
    },
    date(value) {
        if (!value) return ''
        return dayjs(value).locale('ru').utcOffset(3).format('DD.MM.YYYY')
    },
    dateY() {
        return dayjs().locale('ru').utcOffset(3).format('YYYY-MM-DD')
    },
    today() {
        return dayjs().locale('ru').utcOffset(3).format('YYYY-MM-DD')
    },
    yesterday() {
        return dayjs().locale('ru').subtract(1, 'day').utcOffset(3).format('YYYY-MM-DD')
    },
}
