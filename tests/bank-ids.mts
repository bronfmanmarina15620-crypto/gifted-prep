import { GIFTED_BANK as B } from '../src/gifted.ts'
console.log(JSON.stringify(B.map(i=>({id:i.id,type:i.type,plain:i.plain}))))
