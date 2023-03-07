import styles1 from './styles.module.css'
import styles2 from './dir/nested/styles.module.css'
import {otherNestedClass} from './dir/nested/other'

const a = styles1['my-class']
const b = styles2['nested-class']
const c = otherNestedClass

console.log(a, b, c)
