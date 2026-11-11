import { GIFTED_BANK } from '../../src/gifted'
import { writeFileSync } from 'fs'
writeFileSync('/tmp/bank.json', JSON.stringify(GIFTED_BANK))
