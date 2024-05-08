import Chart from 'react-apexcharts'
/* 
  props
  data
*/
export default function ChartCandle(data) {
  const options = {
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    },
  }
  const series = [{
    data: data.data
  }]

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="candlestick"
        height={480}
        width={640}
      />
    </div>
  )
}