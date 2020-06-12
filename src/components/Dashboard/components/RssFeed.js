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

const useStyles = makeStyles((theme) => ({
  header: {
    padding: "8px 8px 0 8px",
    backgroundColor: "#011133",
    color: "white",
  },
  listitem: {
    padding: "10px",
  },
  thumb: {
    height: "16px",
    width: "16px",
    marginRight: "8px",
  },
  source: {
    fontSize: "8px",
  },
  title: {
    fontSize: "12px",
    margin: "2px 0",
    fontWeight: "bold",
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
  "https://feeds.feedburner.com/OilGasJournal-GeneralInterest",
  "https://www.rigzone.com/news/rss/rigzone_latest.aspx",
  "http://www.oilandgas360.com/feed/",
  "http://www.cnbc.com/id/10000030/device/rss",
  "https://www.naturalgasintel.com/rss/1",
  "https://shalemag.com/feed/",
  "http://pboilandgasmagazine.com/feed/",
];

const RssFeed = () => {
  const classes = useStyles();
  const [news, setNews] = useState([]);

  useEffect(() => {
    const proxy = "https://api.rss2json.com/v1/api.json?rss_url=";
    // const newArticles = [];
    const fetchRes = async (url) => {
      try {
        const res = await fetch(`${proxy}${url}`);
        const data = await res.json();
        const { feed, items } = data;
        // console.log({ feed, articles: items });
        return [
          { feed, article: items[0] },
          { feed, article: items[1] },
        ];
      } catch (error) {
        console.log(error);
      }
    };
    Promise.all(rsslist.map((url) => fetchRes(url))).then((articles) => {
      let newArticle = [];
      articles.forEach((a) => !!a && newArticle.push(...a));
    //   console.log(
    //     newArticle.sort((a, b) => a.article.pubDate < b.article.pubDate)
    //   );
      setNews([...news, ...newArticle]);
    });
  }, []);

  return (
    <Fragment>
      <CardHeader
        action={<DragHandle />}
        title={`Latest News`}
        className={classes.header}
      />

      {[...news].map((_, i) => (
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
                <Skeleton variant="rect" className={classes.thumb} />
                <Typography noWrap className={classes.source}>
                  {"BBC News"}
                </Typography>{" "}
              </Grid>
              <Typography variant="h2" className={classes.title}>
                Natural Gas Inventories as of June 5, 2020
              </Typography>
              <Typography className={classes.content}>
                The <a href="http://ir.eia.gov/ngs/ngs.html">EIA</a> has
                released its natural gas inventory report, showing a net
                increa...
              </Typography>
              <Typography noWrap className={classes.date}>
                {"2 days ago"}
              </Typography>
            </Grid>
            <Grid item xs={3} style={{ textAlign: "-webkit-center" }}>
              <Skeleton variant="rect" className={classes.image} />
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Fragment>
  );
};
export default RssFeed;
