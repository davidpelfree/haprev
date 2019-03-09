import React from 'react'
import {View, Text, FlatList, ScrollView, ActivityIndicator} from 'react-native'
import styles from './EventsListStyle'

class ActivityItem extends React.Component{
    constructor(props) {
        super(props)
        this.state={
            showFullActivity:false,
            activityData:'',
            coordinatorData:'',
            deleteVisible: false,
            modalParticipantsVisible:false,
            participants:[],
            avatarsArray:null,
            phonesArray:null,
        }
    }

    renderText = (text,len)=> {
        if (text.length > len )
            return text.slice(0, len - 3) + '...'
        return text
    }

    renderDate = (fullDate,isNextEvents) =>{
        var fulldate = new Date(fullDate)
        var dateString =  fulldate.getDate() + "/" + (fulldate.getMonth() + 1)
        dateString += isNextEvents ?  '' :   "/" + fulldate.getFullYear()
        return dateString
    }

    render() {
        const {activity, index, isNextEvents} = this.props
        return (
            <View style={[styles.activityBox,isNextEvents
                ? {height:30}
                : (index%2 === 0) ? {backgroundColor:'#f9ccac'} : {backgroundColor:'#fff2df'}]}>
                <Text style={[styles.textBox,styles.dateFlex,activity.fullFormatDate < new Date().toISOString()?{color:'#E94B3C'}:{color:'#009B77'} ,{width:isNextEvents?'14%':'22%'}]}>{ this.renderDate(activity.fullFormatDate,isNextEvents)}</Text>
                <Text style={[styles.textBox,styles.timeFlex]}>[ {activity.time} ]</Text>
                <Text style={[styles.textBox,styles.captionFlex]}>
                    { activity && activity.caption && activity.caption.length > 17 ?
                        activity.caption.substring(0, 17 - 3) + '...' : activity.caption }
                </Text>
                <Text style={styles.lineText}>|</Text>
                <Text style={[styles.textBox,styles.hospitalFlex]}>{activity.hospitalName}</Text>
            </View>
        )
    }
}

class EventsListView extends React.Component{
    render() {
        const {processEventsList, activityElements, isNextEvents} = this.props
        return(
            <React.Fragment>
                { !processEventsList ?
                    activityElements.length>0 ?
                        <FlatList
                        style={styles.listContainer}
                        data={activityElements}
                        renderItem={({item, index}) => <ActivityItem isNextEvents={isNextEvents} activity={item} index={index}/>}
                        keyExtractor={(item) => item.id}/>
                    :
                    <Text style={[styles.textBox,styles.noActivitiesText]}> אין מידע על פעילויות </Text>
                :
                <View style={{paddingTop: isNextEvents?5:50,flex:1}}>
                    <ActivityIndicator size='large' color='#C2185B'/>
                </View>
                }
            </React.Fragment>
            )
    }
}

export default EventsListView
