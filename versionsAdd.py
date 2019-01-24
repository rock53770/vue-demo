# -*- coding: utf-8 -*-
# import sys

# open file
dat_out = ""
# totalVersionPath = "/Users/taoy/scripts/app-carseller/version.txt"
codeVersionPath = "./version.txt"
# flag = False

try:
    # totalfin = open(totalVersionPath, "r")
    fin = open(codeVersionPath, "r")
    # print sys.path[0]
    # header line
    header = fin.readline()
    # totalheader = totalfin.readline()
    dat_in = header.split('.')
    # totaldat_in = totalheader.split('.')

    # 比较版本
    # for index in range(len(dat_in)):
    #     if flag == False:
    #         if int(totaldat_in[index]) > int(dat_in[index]):
    #             flag = True

    # if flag:
    #     print "之前app-carseller-master发布了更新的版本,版本号为:" + totalheader + "请确认"
    #     forDat_in = totaldat_in
    # else:
    #     print "旧版本号为:" + header
    #     forDat_in = dat_in
    print "旧版本号为:" + header
    forDat_in = dat_in
    oldVersion = forDat_in[3]
    forDat_in[3] = str(int(oldVersion) + 1)
    for index in range(len(forDat_in)):
        if index < len(forDat_in) - 1:
            dat_out = dat_out + forDat_in[index] + "."
        else:
            dat_out = dat_out + forDat_in[index]
    print "新版本号为:" + dat_out
except IOError:
    print "The file don't exist, Please double check!"
    exit()
finally:
    fin.close()
try:
    fout = open(codeVersionPath, "w")
    fout.write(dat_out)
    # totalfout = open(totalVersionPath, "w")
    # totalfout.write(dat_out)
finally:
    fout.close()
    # totalfout.close()