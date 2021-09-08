const Templater = require('./templater')

describe('Templater', () => {
    it('create instance', () => {
        expect(typeof Templater).toBe('function')
        expect(() => {
            Templater()
        }).not.toThrow()
    })

    it('has proper methods', () => {
        const template = Templater()
        expect(typeof template.div).toBe('function')
        expect(typeof template.br).toBe('function')
    })

    it('renders html', () => {
        expect(Templater().span().toString()).toBe('<span></span>')
        expect(Templater().br().toString()).toBe('<br>')
    })

    it('supports nesting, chaining', () => {
        expect(
            Templater().span('Hello').span('World').toString()
        ).toBe('<span>Hello</span><span>World</span>')
        expect(
            Templater().p(
                Templater().span('nested'),
                Templater().span('span')
            ).toString()
        ).toBe('<p><span>nested</span><span>span</span></p>')
        expect(() => {
            Templater().br('some content')
        }).toThrow()
    })

    it('tags has attributes', () => {
        expect(
            Templater().div('Yeah!', { id: "header", class: "awesome" }).toString()
        ).toBe('<div class="awesome" id="header">Yeah!</div>')
    })
})