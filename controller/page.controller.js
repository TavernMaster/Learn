class PageController {

    main(req, res) {
        res.redirect('index.html')
    }

    chat(req, res) {
        res.redirect('chat.html')
    }
}

const pageController = new PageController()

export default pageController