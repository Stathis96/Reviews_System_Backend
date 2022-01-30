const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { paths } = require('./tsconfig.json')
const moduleNameMapper = pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' })

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: false,
  moduleNameMapper
}

// const { pathsToModuleNameMapper } = require('ts-jest/utils')
// const { compilerOptions } = require('./tsconfig.json')

// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   testPathIgnorePatterns: [
//     '/node_modules/'
//   ],
//   transformIgnorePatterns: [
//     '/node_modules/'
//   ],
//   coverageDirectory: 'coverage',
//   coveragePathIgnorePatterns: [
//     '/node_modules/'
//   ],
//   setupFiles: [
//     './tests/setup.ts'
//   ],
//   moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
// }
