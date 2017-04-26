let demoAnimation = [{
    duration: 500, // duration in ms
    animation: (end, duration, setTimeout, setInterval) => {
        // do animation
    }
},{
    duration: 800, // duration in ms
    delay: 0, // start delay. If not set duration of prev animation is used
    animation: (end, duration, setTimeout, setInterval) => {
        // do animation
    }
}]

export default class AnimationQueue{
    constructor(animationSections){
        this.animationSections = animationSections
        this.timeouts = []
        this.intervals = []
        this.isRunning = false
    }
    start = (cb) => {
        this.isRunning = true
        this.startAnimationRecursive(0, cb)
    }
    abort = () => {
        this.isRunning = false
        this.clearTimeoutsAndIntervals()
    }
    startAnimationRecursive = (sectionStartId, cb) => {
        if(sectionStartId < this.animationSections.length){
            this.runAnimationSection(sectionStartId, ()=>{
                if(sectionStartId+1 < this.animationSections.length && this.isRunning){
                    this.startAnimationRecursive(sectionStartId+1, cb)
                }
                else{
                    this.abort()
                    if(cb) cb()
                }
            })
        }
        else{
            console.log("animation section does not exist")
        }
    }
    runAnimationSection = (sectionId, endCB) => {
        let section = sectionId >= 0 && sectionId < this.animationSections.length ? this.animationSections[sectionId] : undefined
        let prevSection = sectionId > 0 && sectionId < this.animationSections.length ? this.animationSections[sectionId-1] : undefined
        if(section && this.isRunning){
            let delay = section.delay !== undefined ? section.delay : (prevSection ? prevSection.duration : 0)
            this.setTimeoutMock(() => {
                section.animation(() => {
                    this.clearTimeoutsAndIntervals()
                    endCB()
                }, section.duration, this.setTimeoutMock, this.setIntervalMock)
            }, delay)
        }
    }

    setTimeoutMock = (func, ms) => {
        this.timeouts.push(setTimeout(func, ms))
    }
    setIntervalMock = (func, ms) => {
        this.intervals.push(setInterval(func,ms))
    }
    clearTimeoutsAndIntervals = () => {
        this.timeouts.forEach(t => clearTimeout(t))
        this.intervals.forEach(i => clearInterval(i))
    }
}
