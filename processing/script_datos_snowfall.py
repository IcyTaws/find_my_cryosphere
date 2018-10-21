import requests

states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV"]

dates = ["2017" + "%02d"%(i) for i in range(1,13)]
baseurl = "https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/"
# AL-snowfall-201710.csv

for state in states:
    for month in dates:
        filename= state+"-snowfall-"+month+".csv"
        with open(filename,'wb') as f:
            try:
                response = requests.get(baseurl+filename)
                f.write(response.content)
            except Exception as e:
                print(e)
