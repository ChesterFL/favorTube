import Api from '@/services/Api'

export default {
    getInfo() {
        return Api().get('revenue/info')
    }
}
