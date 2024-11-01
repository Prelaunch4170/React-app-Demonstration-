using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Assig2.Data;
using Assig2.Models;
using System.ComponentModel;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Immutable;
using Microsoft.Identity.Client;
using System.Numerics;


namespace Assig2.Controllers.API
{
    using Azure.Identity;
    using Microsoft.AspNetCore.Identity;
    using System.Diagnostics;
    using System.Runtime.Intrinsics.Arm;
    using System.Security.Cryptography;
    using System.Security.Policy;
    using System.Text;


    [Route("api/[action]")]
    [ApiController]
    public class EndpointController : Controller
    {
        private readonly ExpiationsContext _context;
        ImmutableList<string> cameraCodes = ImmutableList.Create("F", "M", "PAC", "I/section", "P2P", "Rail", "Mid Block");
        //Missed 'F' camera type. Thanks to Brian.
        static Dictionary<string, string> loginList = new Dictionary<string, string> { { "cool_fred", sha256hash("hunter2") }, { "large_marge", sha256hash("test123") }, { "a", sha256hash("a") } };
        //hunter2 should map to -> f52fbd32b2b3b86ff88ef6c490628285f482af15ddcb29541f94bcf526a3f6c7
        //test123 should map to -> ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae
        //Try with this tool: https://emn178.github.io/online-tools/sha256.html

        public EndpointController(ExpiationsContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Checks login information against some hardcoded values in this toy example.
        /// </summary>
        /// <param name="userName"> The userName to verify </param>
        /// <param name="passwordHash"> The SHA256'd password </param>
        /// <returns>A bool confirming whether the information provided was correct.</returns>
        // GET: /api/Login
        [HttpPost(Name = "Login"), HttpGet(Name = "Login")]
        public async Task<object> Login(string userName, string passwordHash)
        {
            if (!loginList.ContainsKey(userName)) return false;
            if (loginList[userName].ToLower() == passwordHash.ToLower()) return true;
            return false;
        }

        /// <summary>
        /// Adds a user to the Login Dictonary. This isn't persisted, so will reset when the webserver is restarted.
        /// </summary>
        /// <param name="userName"> The userName to verify </param>
        /// <param name="passwordHash"> The SHA256'd password </param>
        /// <returns>A bool confirming whether the registration information was valid</returns>
        // POST: /api/Register
        [HttpPost(Name = "Register"), HttpGet(Name = "Register")]
        public async Task<object> Register(string userName, string passwordHash)
        {
            if (loginList.ContainsKey(userName)) return false;
            if (passwordHash.Length != 64) return false;
            try
            { BigInteger.Parse(passwordHash, System.Globalization.NumberStyles.HexNumber); }
            catch { return false; }

            loginList[userName] = passwordHash;
            return true;
        }

        /// <summary>
        /// Gets a list of Suburbs that exist in the database.
        /// </summary>
        /// <returns>List of suburbs that contain a Camera. For split suburbs like 'Foo / Bar', returns only the first entry for convenience.</returns>
        // GET: /api/Get_ListCameraSuburbs
        [HttpGet(Name = "Get_ListCameraSuburbs")]
        public async Task<object> Get_ListCameraSuburbs()
        {
            var cameraContext = _context.CameraCodes;
            var suburbs = await cameraContext.Select(i => i.Suburb.Split('/', 2, StringSplitOptions.TrimEntries)[0]).ToListAsync();
            return suburbs.Distinct().OrderBy(i => i);
        }

        /// <summary>
        /// Gets a List of Cameras within a given Suburb. Option to return only the list of locationIds + CameraTypes (Composite Primary Key) only.
        /// </summary>
        /// <param name="suburb">The Selected Suburb</param>
        /// <param name="cameraIdsOnly">Optional: Narrows the return data to just a list of the locationIds + CameraTypeCodes (Composite Primary Key)</param>
        /// <returns>List of Camera's in Suburb. Optionally return only the list of LocationID's</returns>
        // GET: /api/Get_ListCamerasInSuburb?suburb=foo&locationIdsOnly=false
        [HttpGet(Name = "Get_ListCamerasInSuburb")]
        public async Task<object> Get_ListCamerasInSuburb(string suburb, bool cameraIdsOnly = false)
        {
            var cameraContext = _context.CameraCodes;
            Debug.Assert(suburb != null, "Suburb was NULL here.");
            var suburbs = await cameraContext.Where(i => i.Suburb.ToLower().StartsWith(suburb.ToLower()) || i.Suburb.ToLower().StartsWith(" " + suburb.ToLower()))
                .Select(i => new { i.LocationId, i.CameraTypeCode, i.CameraTypeCodeNavigation.CameraType1, i.Suburb, i.RoadName, i.RoadType }).ToListAsync();
            //Tks to Andre for noticing some Suburbs start with " Adelaide". If this version is slower or you don't like it, relpace with previous version ->
            // var suburbs = await cameraContext.Where(i => i.Suburb.ToLower().StartsWith(suburb.ToLower()))
            // .Select(i => new { i.LocationId, i.CameraTypeCode, i.CameraTypeCodeNavigation.CameraType1, i.Suburb, i.RoadName, i.RoadType }).ToListAsync();
            if (cameraIdsOnly)
            {
                return suburbs.Select(i => new { i.LocationId, i.CameraTypeCode });
            }

            return suburbs.OrderBy(i => i.LocationId);
        }

        //this one
        /// <summary>
        /// Gets a List of Offences with a given Description. Option to return only the list of Offence Codes. Offences are the list of named Offences codes (not the list of expiations).
        /// </summary>
        /// <param name="searchTerm">The search term to find in the Offences table's Offence.Description</param>
        /// <param name="offenceCodesOnly">Optional: Return only the list of Offence Codes that match the query</param>
        /// <returns>A List of the Offences that contain the searchTerm. Optionally return only the list of the matching Offence codes./returns>
        // GET: /api/Get_SearchOffencesByDescription?suburb=foo&locationIdsOnly=false
        [HttpGet(Name = "Get_SearchOffencesByDescription")]
        public async Task<object> Get_SearchOffencesByDescription(string searchTerm = "", bool offenceCodesOnly = false)
        {
            //Try seaching for "Speed" or "Exceed" for speeding offences
            var expiationCategoryContext = _context.Offences;
            var expiationCategories = await expiationCategoryContext.Where(i => i.Description.ToLower().Contains(searchTerm.ToLower())).Select(i => i).ToListAsync();
            if (offenceCodesOnly)
            {
                return expiationCategories.Select(i => i.OffenceCode);
            }
            return expiationCategories.OrderBy(i => i.OffenceCode);
        }

        //This one
        /// <summary>
        /// Gets a list of Expiations for a given LocationId + Camera Type. Option to return only the list of Offence Codes
        /// </summary>
        /// <param name="locationId">The locationId to use in the Expiation search. A specific camera is a composite of locationId + Camera Type</param>
        /// <param name="cameraTypeCode">The Camera Type to use in the Expiation search. A specific camera is a composite of locationId + Camera Type. If you omit this, you might get invalid results. (This is a you problem).</param>
        /// <param name="startTime">Optional: Return only Offences that happened after this start time. Uses Unix timestamp notation. Defaults to 0 (All Offences)</param>
        /// <param name="endTime">Optional: Return only Offences that happened before this end time. Uses Unix timestamp notation. Defaults to Int32.Max (All Offences)</param>
        /// <param name="offenceCodes">Optional: Return only Offences that include the current offenceCode. Multiple inputs allowed to extend the List. E.g. ["A001","A002"] </param>
        /// <returns>List&lt;Expiation&gt;. i.e a List of matching Expiation. Check the relationial diagram on the course website to help determine what fields are contained in the table.</returns>
        [HttpPost(Name = "Get_ExpiationsForLocationId"), HttpGet(Name = "Get_ExpiationsForLocationId")]
        public async Task<object> Get_ExpiationsForLocationId(int locationId, string? cameraTypeCode, int startTime = 0, int endTime = Int32.MaxValue, [FromQuery] List<String>? offenceCodes = null)
        {

            Debug.Assert(cameraTypeCode == null || cameraCodes.Contains(cameraTypeCode), "Your provided cameraTypeCode wasn't in the list");
            Debug.Assert(locationId > 0, "locationId was 0 or null. You must supply valid locationId or things will explode (this is bad). Try fetching from Get_ListCamerasInSuburb");
            var dateRangeStart = DateOnlyRange_IHateTimezones(startTime, -1);
            var dateRangeEnd = DateOnlyRange_IHateTimezones(endTime, 1);

            offenceCodes ??= new List<string>(); //Initialize List if it's null / default

            var offencesContext = _context.Expiations;
            IQueryable<Expiation>? offences;

            if (cameraTypeCode == null)
            {
                //I'm going to assume you know what you're doing
                offences = offencesContext.Where(i => i.CameraLocationId == locationId
                && i.IncidentStartDate >= dateRangeStart && i.IncidentStartDate <= dateRangeEnd);
            }
            else
            {
                offences = offencesContext.Where(i => i.CameraLocationId == locationId && i.CameraTypeCode.ToLower() == cameraTypeCode.ToLower()
           && i.IncidentStartDate >= dateRangeStart && i.IncidentStartDate <= dateRangeEnd);
            }

            var offencesEnum = offences.AsEnumerable();

            if (startTime != 0)
            {
                //I do it like this because Linq to Objects has better functionality for matching datetimes
                //But I still want to somewhat limit results when doing Linq to SQL, so fetch doesn't take forever
                offencesEnum = offencesEnum.Where(i => DateTimeToUnixTime(i.IncidentStartDate, i.IncidentStartTime) >= startTime);
            }

            if (endTime != Int32.MaxValue)

            {
                //I do it like this because Linq to Objects has better functionality for matching datetimes
                //But I still want to somewhat limit results when doing Linq to SQL, so fetch doesn't take forever
                offencesEnum = offencesEnum.Where(i => DateTimeToUnixTime(i.IncidentStartDate, i.IncidentStartTime) <= endTime);
            }

            if (offenceCodes.Count() > 0)
            {
                offencesEnum = offencesEnum.Where(i => offenceCodes.Contains(i.OffenceCode));
            }

            return await Task.FromResult(offencesEnum.ToList());
        }

        /// <summary>
        /// Gets aggregated stats for a given LocationId + CameraType. Returns a bunch of stats you might be interested in. Feel free to extend the functionality.
        /// </summary>
        /// <param name="locationId">The locationId to use in the Expiation search. A specific camera is a composite of locationId + Camera Type</param>
        /// <param name="cameraTypeCode">The Camera Type to use in the Expiation search. A specific camera is a composite of locationId + Camera Type. If you omit this, you might get invalid results. (This is a you problem).</param>
        /// <param name="startTime">Optional: Return only Offences that happened after this start time. Uses Unix timestamp notation. Defaults to 0 (All Offences)</param>
        /// <param name="endTime">Optional: Return only Offences that happened before this end time. Uses Unix timestamp notation. Defaults to Int32.Max (All Offences)</param>
        /// <param name="offenceCodes">Optional: Return only Offences that include the current offenceCode. Multiple inputs allowed to extend the List: ["A001","A002"] </param>
        /// <returns>firstExpiationInSet, lastExpiationInSet, totalOffencesCount, totalDemerits, totalFeeSum, avgDemeritsPerDay, avgFeePerDay, expiationDaysOfWeek</returns>
        [HttpPost(Name = "Get_ExpiationStatsForLocationId"), HttpGet(Name = "Get_ExpiationStatsForLocationId")]
        public async Task<object> Get_ExpiationStatsForLocationId(int locationId, string? cameraTypeCode, int startTime = 0, int endTime = Int32.MaxValue, [FromQuery] List<String>? offenceCodes = null)
        {
            Debug.Assert(cameraTypeCode == null || cameraCodes.Contains(cameraTypeCode), "Your provided cameraTypeCode wasn't in the list");
            Debug.Assert(locationId > 0, "locationId was 0 or null. You must supply valid locationId or things will explode (this is bad). Try Get_ListCamerasInSuburb");
            var dateRangeStart = DateOnlyRange_IHateTimezones(startTime, -1);
            var dateRangeEnd = DateOnlyRange_IHateTimezones(endTime, 1);

            offenceCodes ??= new List<string>(); //Initialize list if it's null / default

            var offencesContext = _context.Expiations;
            var offenceTypesContext = _context.Offences;

            IQueryable<Expiation>? offences;

            if (cameraTypeCode == null)
            {
                //I'm going to assume you know what you're doing
                offences = offencesContext.Where(i => i.CameraLocationId == locationId
                && i.IncidentStartDate >= dateRangeStart && i.IncidentStartDate <= dateRangeEnd);
            }
            else
            {
                offences = offencesContext.Where(i => i.CameraLocationId == locationId && i.CameraTypeCode.ToLower() == cameraTypeCode.ToLower()
           && i.IncidentStartDate >= dateRangeStart && i.IncidentStartDate <= dateRangeEnd);
            }

            var offencesEnum = offences.AsEnumerable();

            if (startTime != 0)
            {
                offencesEnum = offencesEnum.Where(i => DateTimeToUnixTime(i.IncidentStartDate, i.IncidentStartTime) >= startTime);
            }

            if (endTime != Int32.MaxValue)

            {
                offencesEnum = offencesEnum.Where(i => DateTimeToUnixTime(i.IncidentStartDate, i.IncidentStartTime) <= endTime);
            }

            if (offenceCodes.Count() > 0)
            {
                offencesEnum = offencesEnum.Where(i => offenceCodes.Contains(i.OffenceCode));
            }

            offencesEnum = offencesEnum.OrderBy(i => i.IncidentStartDate).ThenBy(i => i.IncidentStartTime);

            var totalFeeSum = 0;
            var totalOffencesCount = 0;
            int totalDemerits = 0;
            var demeritsDict = new Dictionary<string, int>();
            int firstExpiationInSet = 0;
            int lastExpiationInSet = 0;
            int diff = 0;
            double avgDemeritsPerDay = 0;
            double avgFeePerDay = 0;

            var offencesData = offenceTypesContext.Select(i => new { i.OffenceCode, i.DemeritPoints }).ToList();
            //Eh, you can optimise this if you want. Select only relevant Offences. Or Select once, save to JSON file locally, then query the local file.
            demeritsDict = offencesData.ToDictionary(pair => pair.OffenceCode, pair => pair.DemeritPoints ?? 0);

            var expiationDaysOfWeek = new Dictionary<string, int>() { ["Monday"] = 0, ["Tuesday"] = 0, ["Wednesday"] = 0, ["Thursday"] = 0, ["Friday"] = 0, ["Saturday"] = 0, ["Sunday"] = 0 };

            if (offenceCodes.Count() > 0)
            {
                offencesEnum = offencesEnum.Where(i => offenceCodes.Contains(i.OffenceCode));
            }

            foreach (var expiation in offencesEnum.Select(i => new { i.OffenceCode, i.IncidentStartDate, i.BacContentExp, i.TotalFeeAmt }))
            {
                expiationDaysOfWeek[expiation.IncidentStartDate.DayOfWeek.ToString()]++;
                totalFeeSum += expiation.TotalFeeAmt ?? 0;
                totalOffencesCount++;
                totalDemerits += demeritsDict.GetValueOrDefault(expiation.OffenceCode ?? "", 0);
            }
            if (totalOffencesCount > 0)
            {
                firstExpiationInSet = DateTimeToUnixTime(offencesEnum.First().IncidentStartDate, offencesEnum.First().IncidentStartTime);
                lastExpiationInSet = DateTimeToUnixTime(offencesEnum.Last().IncidentStartDate, offencesEnum.Last().IncidentStartTime);
                diff = lastExpiationInSet - firstExpiationInSet;

            }

            if (diff == 0) diff = 86400;

            avgDemeritsPerDay = 86400d / (double)diff * totalDemerits;
            avgFeePerDay = 86400d / (double)diff * totalFeeSum;

            return new { firstExpiationInSet, lastExpiationInSet, totalOffencesCount, totalDemerits, totalFeeSum, avgDemeritsPerDay, avgFeePerDay, expiationDaysOfWeek };
        }

        //Helper methods, don't mind me
        private static int DateTimeToUnixTime(DateOnly date, TimeOnly time)
        {
            DateTime combined = new DateTime(date, time);

            int unixTime = (int)((DateTimeOffset)combined).ToUnixTimeSeconds();
            return unixTime;
        }

        private static DateOnly DateOnlyRange_IHateTimezones(int unixTime, int add)
        {
            DateTime dateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dateTime = dateTime.AddSeconds(unixTime);
            return DateOnly.FromDateTime(dateTime).AddDays(add);
        }

        //Thx stack overflow
        //VS Studio  uses UTF-16 by default, so we have to cast the string to UTF-8 first
        //https://stackoverflow.com/questions/12416249/hashing-a-string-with-sha256
        private static string sha256hash(string input)
        {
            var inputBytes = Encoding.UTF8.GetBytes(input);
            var inputHash = SHA256.HashData(inputBytes);
            return Convert.ToHexString(inputHash);
        }

    }
}