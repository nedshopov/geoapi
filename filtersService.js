class FiltersService {

    constructor() {
        this.getFirstResult = (result) => { return result[0] }
    }
    getFiltersPredicate(filters, getFirst = true) {
        let predicate

        if (filters.length > 0) {
            const filterCategories = (result) => {
                return result.filter(element => {
                    const elCategories = element.categories.split(",")
                    const filterCategories = filters.split(",")
                    return elCategories.some(c => { return filterCategories.indexOf(c) !== -1 })
                })
            }
            predicate = (result) => { return filterCategories(getFirst ? this.getFirstResult(result) : result) }
        } else { predicate = this.getFirstResult }

        return predicate
    }
}

module.exports = FiltersService