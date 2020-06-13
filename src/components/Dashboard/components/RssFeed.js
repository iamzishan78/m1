import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import { sortableHandle } from "react-sortable-hoc";
import React, {
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
  Fragment,
} from "react";
import { Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import CardMedia from "@material-ui/core/CardMedia";
import moment from "moment";
import M1neralIconSvg from "../../Shared/m1neralIconSvg";
import List from "@material-ui/core/List";

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
    width: "16px",
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
    height: "72px",
    // width: "72px",
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
    image: "https://base.imgix.net/files/base/pennwell/ogj/logo.png?h=60",
  },
  {
    title: "Rigzone",
    url: "https://www.rigzone.com/news/rss/rigzone_latest.aspx",
  },
  {
    title: "Oil and Gas 360",
    url: "http://www.oilandgas360.com/feed/",
    image:
      "https://www.oilandgas360.com/wp-content/uploads/2014/09/OAG-Logo-325x90_rev.png",
  },
  { title: "CNBC", url: "http://www.cnbc.com/id/10000030/device/rss" },
  { title: "NGI Shale Daily", url: "https://www.naturalgasintel.com/rss/1" },
  { title: "Shalemag", url: "https://shalemag.com/feed/" },
  {
    title: "PB Oil and Gas Magazine",
    url: "http://pboilandgasmagazine.com/feed/",
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
        // return [
        //   { source: title, feed, article: items[0], image },
        //   { source: title, feed, article: items[1], image },
        //   { source: title, feed, article: items[2], image },
        //   { source: title, feed, article: items[3], image },
        //   { source: title, feed, article: items[4], image },
        // ];
      } catch (error) {
        console.log(error);
      }
    };
    Promise.all(rsslist.map((source) => fetchRss(source))).then((articles) => {
      let newArticles = [];
      articles.forEach((a) => !!a && newArticles.push(...a));
      const sorted = newArticles.sort((a, b) =>
        a.article.pubDate > b.article.pubDate ? -1 : 1
      );
      console.log(sorted);
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

  return (
    <Fragment>
      <CardHeader
        action={<DragHandle />}
        title={`Latest News`}
        className={classes.header}
      />

      <List style={{ maxHeight: "calc(100% - 40px)", overflow: "auto" }}>
        {news.map(({ feed, article, source, image }, i) => (
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
                  {!!(article.enclosure.link || feed.image) ? (
                    <CardMedia
                      className={classes.thumb}
                      component={"img"}
                      image={feed.image || article.enclosure.link}
                      title="thumbnail"
                    />
                  ) : (
                    <M1neralIconSvg size={{ height: "16px", width: "16px" }} />
                  )}
                  {/* <Skeleton variant="rect" className={classes.thumb} /> */}
                  <Typography noWrap className={classes.source}>
                    {cleanedText(feed.title)}
                  </Typography>{" "}
                </Grid>
                <Typography
                  component="a"
                  href={article.link}
                  variant="h2"
                  className={classes.title}
                >
                  {truncate(article.title, 50)}
                </Typography>
                <Typography className={classes.content}>
                  {truncate(cleanedText(article.content), 100)}
                </Typography>
                <Typography noWrap className={classes.date}>
                  {moment.utc(article.pubDate).local().fromNow()}
                </Typography>
              </Grid>
              <Grid item xs={3} style={{ textAlign: "-webkit-center" }}>
                {!!(article.enclosure.link || feed.image) ? (
                  <CardMedia
                    className={classes.image}
                    component={"img"}
                    image={article.enclosure.link || feed.image}
                    title="Image"
                  />
                ) : (
                  <M1neralIconSvg />
                )}
              </Grid>
            </Grid>
          </Paper>
        ))}
      </List>
    </Fragment>
  );
};
export default RssFeed;
