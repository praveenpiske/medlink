import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import { BsBorder } from 'react-icons/bs';
import { TbBorderRadius } from 'react-icons/tb';


export default function NewsCard({ title, description, url, imageUrl }) {
    return (
      <Card className="article" style={{ borderRadius: 15,
        boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
        transition: '0.3s',
        width: '16rem',
        height: '20rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop : '10px',
        marginBottom: '10px',
        marginLeft: '10px',
        
       }}>
        <CardActionArea>
          <CardMedia component="img" height="140" image={imageUrl} alt={title} style={{
            height: '10rem',
            objectFit: 'cover',
            borderRadius: '15px, 15px, 15px, 15px',
          }} />
          <CardContent>
            <Typography gutterBottom variant="h7">{title}</Typography>
            
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" href={url} target="_blank">
            Read More
          </Button>
        </CardActions>
      </Card>
    );
  }
  