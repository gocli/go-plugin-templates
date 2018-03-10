const createTemplate = (template: string) => {
  if (typeof template !== 'string') {
    throw new Error('template is required and it should be a string')
  }

  return () => template
}

export default createTemplate
export { createTemplate }
