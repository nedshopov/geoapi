class FiltersService {
    getFirstResult = (result) => result[0]

    getFiltersPredicate(filters) {
        let predicate

        if (filters.categories.length > 0) {
            const filterCategories = (result) => result.filter(element => {
                const elCategories = element.categories.split(",")
                const filterCategories = filters.categories.split(",")
                return elCategories.some(c => filterCategories.indexOf(c) !== -1)
            })
            predicate = result => filterCategories(this.getFirstResult(result))
        } else { predicate = this.getFirstResult }

        return predicate
    }
}

module.exports = FiltersService