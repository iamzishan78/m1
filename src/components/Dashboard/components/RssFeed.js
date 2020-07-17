import { Grid } from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { sortableHandle } from "react-sortable-hoc";
import M1neralIconSvg from "../../Shared/m1neralIconSvg";
import cnbc from "./RSSFeedIcons/cnbc1.svg";
import feedimage from "./RSSFeedIcons/feedburner.png";
import ngi from "./RSSFeedIcons/ngi.png";
import oilngas from "./RSSFeedIcons/oilngas.png";
import pbgas from "./RSSFeedIcons/pbgas.png";
import rigzone from "./RSSFeedIcons/rigzone.svg";
import smag from "./RSSFeedIcons/smag.webp";

const useStyles = makeStyles((theme) => ({
  header: {
    padding: "8px 8px 0 8px",
    backgroundColor: "#011133",
    color: "white",
  },
  container: {},
  listitem: {
    padding: "10px",
  },
  thumb: {
    height: "16px",
    maxWidth: "16px",
  },
  source: {
    fontSize: "8px",
    marginLeft: "8px",
  },
  title: {
    fontSize: "12px",
    margin: "2px 0",
    fontWeight: "bold",
    textDecoration: "none",
    color: "black",
  },
  content: {
    fontSize: "10px",
    marginBottom: "2px",
  },
  date: {
    fontSize: "8px",
  },
  paper: {
    margin: "8px 4px",
  },
  image: {
    maxHeight: "72px",
    maxWwidth: "72px",
    borderRadius: "4px",
  },
}));

const DragHandle = sortableHandle(() => (
  <IconButton aria-label="drag">
    <DragIndicatorOutlinedIcon fontSize="default" htmlColor="#fff" />
  </IconButton>
));

const rsslist = [
  {
    title: "FeedBurner",
    url: "https://feeds.feedburner.com/OilGasJournal-GeneralInterest",
    image: feedimage,
  },
  {
    title: "Rigzone",
    url: "https://www.rigzone.com/news/rss/rigzone_latest.aspx",
    image: rigzone,
  },
  {
    title: "Oil and Gas 360",
    url: "http://www.oilandgas360.com/feed/",
    image: oilngas,
  },
  {
    title: "CNBC",
    url: "http://www.cnbc.com/id/10000030/device/rss",
    image: cnbc,
  },
  {
    title: "NGI Shale Daily",
    url: "https://www.naturalgasintel.com/rss/1",
    image: ngi,
  },
  { title: "Shalemag", url: "https://shalemag.com/feed/", image: smag },
  {
    title: "PB Oil and Gas Magazine",
    url: "http://pboilandgasmagazine.com/feed/",
    image: pbgas,
  },
];

const RssFeed = () => {
  const classes = useStyles();
  const [news, setNews] = useState([]);

  useEffect(() => {
    const proxy = "https://api.rss2json.com/v1/api.json?rss_url=";
    const fetchRss = async ({ url, title, image }) => {
      try {
        const res = await fetch(`${proxy}${url}`);
        const data = await res.json();
        const { feed, items } = data;
        return items.map((item, i) => ({
          source: title,
          feed,
          article: item,
          image,
        }));
      } catch (error) {
        console.log(error, url);
      }
    };
    Promise.all(rsslist.map((source) => fetchRss(source))).then((articles) => {
      let newArticles = [];
      articles.forEach((a) => !!a && newArticles.push(...a));
      const sorted = newArticles.sort((a, b) =>
        a.article.pubDate > b.article.pubDate ? -1 : 1
      );
      setNews([...news, ...sorted]);
    });
  }, []);

  const truncate = (str, num) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };

  const cleanedText = (text) => {
    const el = document.createElement("div");
    el.innerHTML = text;
    const sanitized = el.textContent;
    return sanitized;
  };

  const sentenceCase = (sen) =>
    sen
      .split("")
      .map((c, i) => {
        if (i == 0) return c.toUpperCase();
        return c;
      })
      .join("");

  return (
    <Fragment>
      <CardHeader
        action={<DragHandle />}
        title={`Latest News`}
        className={classes.header}
      />

      <List style={{ maxHeight: "calc(100% - 48px)", overflow: "auto" }}>
        {news.map(({ feed, article, source, image }, i) => {
          const thumbImage = image || feed.image || article.enclosure.link;
          const mainImage = article.enclosure.link || feed.image || image;
          const time = moment.utc(article.pubDate).local().fromNow();
          return (
            <Paper key={i} className={classes.paper}>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                className={classes.listitem}
                spacing={1}
              >
                <Grid item xs={9} zeroMinWidth>
                  <Grid container alignItems="center">
                    {!!thumbImage ? (
                      <CardMedia
                        className={classes.thumb}
                        component={"img"}
                        image={thumbImage}
                        title="thumbnail"
                      />
                    ) : (
                      <M1neralIconSvg
                        size={{ height: "16px", width: "16px" }}
                      />
                    )}
                    <Typography noWrap className={classes.source}>
                      {cleanedText(feed.title)}
                    </Typography>{" "}
                  </Grid>
                  <Typography
                    component="a"
                    href={article.link}
                    variant="h2"
                    className={classes.title}
                    target="_blank"
                  >
                    {truncate(article.title, 50)}
                  </Typography>
                  <Typography className={classes.content}>
                    {truncate(cleanedText(article.content), 100)}
                  </Typography>
                  <Typography noWrap className={classes.date}>
                    {sentenceCase(time)}
                  </Typography>
                </Grid>
                <Grid item xs={3} style={{ textAlign: "-webkit-center" }}>
                  {!!mainImage ? (
                    <CardMedia
                      className={classes.image}
                      component={"img"}
                      image={mainImage}
                      title="Image"
                    />
                  ) : (
                    <M1neralIconSvg />
                  )}
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </List>
    </Fragment>
  );
};
export default RssFeed;
