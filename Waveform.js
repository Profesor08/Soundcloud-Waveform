/**
 * Created by Profesor08 on 11.04.2017.
 */


class Waveform
{

  constructor(container, data, params)
  {
    this.container = container;
    this.data = data;
    this.config = {
      lineWidth: 3,
      lineHeight: 3,
      color: {
        background: "#8C8C8C",
        footer: "#B2B2B2",
        footerPlayback: "#FFAA80",
        hoverGradient: {
          from: "#FF7200",
          to: "#DA4218"
        },
        playbackGradient: {
          from: "#FF7200",
          to: "#DA4218"
        },
        hoverPlaybackGradient: {
          from: "#AB5D20",
          to: "#A84024"
        }
      }
    };

    this.currentTime = 0;

    this.mouseHover = false;

    if (params)
    {
      Object.assign(this.config, params);
    }

    this.canvas = document.createElement("canvas");
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    let oldWidth = this.container.clientWidth;
    let oldHeight = this.container.clientHeight;

    window.addEventListener("resize", () =>
    {
      if (oldWidth !== this.container.clientWidth || oldHeight !== this.container.clientHeight)
    {
      this.createWaveform();
    }
  });

    this.canvas.addEventListener("mousemove", event =>
    {
      let rect = this.canvas.getBoundingClientRect();
    this.mouseHover = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    this.createWaveform();
  });

    this.canvas.addEventListener("mouseleave", () =>
    {
      this.mouseHover = null;
    this.ctx.strokeStyle = this.config.color.background;
    this.createWaveform();
  });

    this.createWaveform();
  }

  createWaveform()
  {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.ctx.strokeStyle = this.config.color.background;
    this.ctx.lineWidth = 2;

    let inc = this.data.length / this.container.clientWidth * this.config.lineWidth;
    let count = Math.floor(this.data.length / inc);

    let playback = this.canvas.width / 100 * this.currentTime;

    for (let i = 0, x = 0; i < count; i++, x += this.config.lineWidth)
    {
      let height = this.canvas.height / 140 * this.data[Math.round(i * inc)];
      let y = (this.canvas.height / 2 - height / 2) * 1.5;
      let lineBreak = Math.floor(this.canvas.height / 1.33333) - 1;

      if (this.mouseHover && this.mouseHover.x >= x)
      {
        let gradient = this.ctx.createLinearGradient(x, y, x, lineBreak);
        gradient.addColorStop(0, this.config.color.hoverGradient.from);
        gradient.addColorStop(1, this.config.color.hoverGradient.to);
        this.ctx.strokeStyle = gradient;
      }
      else
      {
        if (playback >= x)
        {
          if (this.mouseHover)
          {
            let gradient = this.ctx.createLinearGradient(x, y, x, lineBreak);
            gradient.addColorStop(0, this.config.color.hoverPlaybackGradient.from);
            gradient.addColorStop(1, this.config.color.hoverPlaybackGradient.to);
            this.ctx.strokeStyle = gradient;
          }
          else
          {
            let gradient = this.ctx.createLinearGradient(x, y, x, lineBreak);
            gradient.addColorStop(0, this.config.color.playbackGradient.from);
            gradient.addColorStop(1, this.config.color.playbackGradient.to);
            this.ctx.strokeStyle = gradient;
          }
        }
        else
        {
          this.ctx.strokeStyle = this.config.color.background;
        }
      }

      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x, lineBreak);
      this.ctx.stroke();

      if (playback >= x)
      {
        this.ctx.strokeStyle = this.config.color.footerPlayback;
      }
      else
      {
        this.ctx.strokeStyle = this.config.color.footer;
      }

      this.ctx.beginPath();
      this.ctx.moveTo(x, lineBreak + 1);
      this.ctx.lineTo(x, height + y);
      this.ctx.stroke();
    }
  }

  setPlayback(currentTime)
  {
    this.currentTime = currentTime;

    this.update();
  }

  update(data)
  {
    if (data)
    {
      this.data = data;
    }

    this.createWaveform();
  }
}