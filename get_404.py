#!/usr/bin/env python3

#./get_404.py sobre.arquivo.pt

import urllib.request
import json
import requests
import sys

def download(url, file_name):
	'''
	Download 'url' to 'file_name'
	'''
	with urllib.request.urlopen(url) as response, open(file_name, 'wb') as out_file:
	    data = response.read()
	    out_file.write(data)

def load_cdxj(file_name):
	'''
	Read cdxj file and returns a list
	'''
	with open(file_name, 'r') as file:
		# read the file and append a comma at the end of each line except the last one
	    data = file.read().replace( '\n', ',\n' )[:-2]
	    json_array = json.loads( '[' + data + ']' )
	
	#print(json_array)
	return json_array

def main():
	#url_search_domain='sobre.arquivo.pt'
	url_search_domain = sys.argv[1]
	url_cdx_api='https://arquivo.pt/wayback/cdx?filter==status:200&matchType=domain&fl=url&output=json&url='+url_search_domain
	file_name = url_search_domain.replace('.','_') + '.cdxj'

	download(url_cdx_api, file_name)
	cdxj_entries = load_cdxj(file_name)

	archived_urls = set()
	for archived_cdxj_entry in cdxj_entries:
		url = archived_cdxj_entry['url']
		archived_urls.add(url)

	#print(archived_urls)

	for url in archived_urls:
		r = requests.get(url)
		status_code = r.status_code

		if (status_code == int(404)):
			print("Status " + str(status_code) + " on: " + url)

if __name__ == "__main__":
    main()
